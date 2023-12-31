export const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.anyOf([String, Array]),
  statusCode: expect.any(Number),
}

export const metaDataResponse = {
  fullName: expect.any(String),
}
