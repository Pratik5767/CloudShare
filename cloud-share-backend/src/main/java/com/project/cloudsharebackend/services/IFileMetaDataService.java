package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.dto.FileMetadataDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IFileMetaDataService {

    List<FileMetadataDto> uploadFiles(MultipartFile[] files) throws IOException;

    List<FileMetadataDto> getFiles();

    FileMetadataDto getPublicFile(String id);

    FileMetadataDto getDownloadableFile(String id);

    void deleteFile(String id);

    FileMetadataDto togglePublic(String id);
}
