import ImgurClient from '@/lib/imgur'

/**
 * Uploads an image to Imgur.
 *
 * @param {File} file - The image file to be uploaded.
 * @param {string} title - Optional title for the uploaded image.
 */
export async function uploadImage(file: File, title?: string) {
  // Convert the file to an ArrayBuffer
  const fileArrayBuffer = await file.arrayBuffer()

  // Convert the ArrayBuffer to a Buffer
  const buffer = Buffer.from(fileArrayBuffer)

  // Upload the image to Imgur
  const imageUploadResponse = await ImgurClient.upload({
    image: buffer,
    title: title,
  })

  if (!imageUploadResponse.success) return null
  const response: UploadedImage = {
    id: imageUploadResponse.data.id,
    deleteHash: imageUploadResponse.data.deletehash ?? '',
    link: imageUploadResponse.data.link.toString(),
  }
  return response
}
