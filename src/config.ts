const Config = {
  API_URL: "http://localhost:6014/api",
  REDIRECT_URL_ON_HOMEPAGE: "https://some-url.com",
  REDIRECT_URL_ON_MODEL_PAGE_HEADER: "https://some-url.com",
  MIN_NUMBER_OF_DOCUMENTS_FOR_TRAIN: 5,
  MIN_NUMBER_OF_ANNOTATIONS_PER_DOCUMENT: 1,
  ANNOTATION_TYPES: [
    10,
    11,
    12,
    40,
    70,
    71,
    72
  ],
  AWS: {
    IDENTITY_POOL_ID: "us-east-1:1caf855a-8fbe-4a59-9b02-38e6d2e279d9",
    REGION: "us-east-1",
    BUCKET: "model-builder-dev"
  }
}

export default Config