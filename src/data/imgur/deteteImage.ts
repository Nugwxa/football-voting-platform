import ImgurClient from '@/lib/imgur'

/**
 * Deletes an image from Imgur using the delete hash.
 *
 * @param {string} deleteHash - The delete hash of the image to be deleted.
 */
export async function deleteImage(deleteHash: string) {
  const res = await ImgurClient.deleteImage(deleteHash)
}
