const BASEURL = 'http://localhost:8080/api/v1';

export const apiEndpoints = {
    FETCH_FILES: `${BASEURL}/files/my`,
    TOGGLE_FILE: (id) => `${BASEURL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE: (id) => `${BASEURL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASEURL}/files/${id}`,
    GET_CREDITS: `${BASEURL}/users/credits`,
    UPLOAD_FILES: `${BASEURL}/files/upload`
}