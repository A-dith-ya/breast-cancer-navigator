const CONTENT_QUERY = `*[_type == "questions"] {
    question,
    "images": Images[]{
      "questionIndex": questionIndex,
      "optionIndex": optionIndex,
      "imageUrl": image.asset->url
    }
    }`;

export { CONTENT_QUERY };
