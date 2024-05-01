import axiosInstance from "../plugins/axios-instance";
import {Customer} from "../types/customer";
import {StyleRecommend, StyleRecommends} from "../types/style";

class FileApi {
  async uploadFile(dir, file): Promise<string> {
    const formData = new FormData();
    formData.append("uploadFile", file);
    return axiosInstance.post(`/api/upload-image?dirName=${dir}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(res => {
      console.log(res.data);
      return res.data.imageUrl;
    });
  }
}

export const fileApi = new FileApi();
