package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.documents.FileMetadataDocument;
import com.project.cloudsharebackend.documents.ProfileDocument;
import com.project.cloudsharebackend.dto.FileMetadataDto;
import com.project.cloudsharebackend.repositories.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataServiceImpl implements IFileMetaDataService {

    private final IProfileService profileService;
    private final IUserCreditsService userCreditsService;
    private final FileMetadataRepository fileMetadataRepository;

    @Override
    public List<FileMetadataDto> uploadFiles(MultipartFile[] files) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> savedFiles = new ArrayList<>();

        if (!userCreditsService.hasEnoughCredits(files.length)) {
            throw new RuntimeException("Not enough credits to upload files");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for(MultipartFile file: files) {
            String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadataDocument fileMetadata = FileMetadataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .fileType(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            userCreditsService.consumeCredit();
            savedFiles.add(fileMetadataRepository.save(fileMetadata));
        }
        return savedFiles.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<FileMetadataDto> getFiles() {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> files = fileMetadataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FileMetadataDto getPublicFile(String id) {
        Optional<FileMetadataDocument> file = fileMetadataRepository.findById(id);
        if (file.isEmpty() || !file.get().getIsPublic()) {
            throw new RuntimeException("Unable to get the file");
        }
        FileMetadataDocument document = file.get();
        return mapToDto(document);
    }

    @Override
    public FileMetadataDto getDownloadableFile(String id) {
        FileMetadataDocument file = fileMetadataRepository.findById(id).orElseThrow(() ->
                new RuntimeException("File not found"));
        return mapToDto(file);
    }

    @Override
    public void deleteFile(String id) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id).orElseThrow(() ->
                    new RuntimeException("File not found"));
            if (!file.getClerkId().equals(currentProfile.getClerkId())) {
                throw new RuntimeException("File does not belong to current user");
            }
            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);
            fileMetadataRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting the file: " + e.getMessage());
        }
    }

    @Override
    public FileMetadataDto togglePublic(String id) {
        FileMetadataDocument file = fileMetadataRepository.findById(id).orElseThrow(()
                -> new RuntimeException("File not found"));
        file.setIsPublic(!file.getIsPublic());
        fileMetadataRepository.save(file);
        return mapToDto(file);
    }

    private FileMetadataDto mapToDto(FileMetadataDocument fileMetadataDocument) {
        return FileMetadataDto.builder()
                .id(fileMetadataDocument.getId())
                .fileLocation(fileMetadataDocument.getFileLocation())
                .name(fileMetadataDocument.getName())
                .size(fileMetadataDocument.getSize())
                .fileType(fileMetadataDocument.getFileType())
                .clerkId(fileMetadataDocument.getClerkId())
                .isPublic(fileMetadataDocument.getIsPublic())
                .uploadedAt(fileMetadataDocument.getUploadedAt())
                .build();
    }
}
