import api from "./api";

// SINGLE IMAGE
export const uploadImage = async (
  file: File,
) => {
  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  const response =
    await api.post(
      "/upload/single",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      },
    );

  return response.data;
};

// MULTIPLE IMAGE
export const uploadImages =
  async (
    files: FileList,
  ) => {
    const formData =
      new FormData();

    for (
      let i = 0;
      i < files.length;
      i++
    ) {
      formData.append(
        "files",
        files[i],
      );
    }

    const response =
      await api.post(
        "/upload/multiple",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        },
      );

    return response.data;
  };