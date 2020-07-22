import { processors } from "xml2js"

const config = {
  baseURL: "http://openapi.its.ulsan.kr/UlsanAPI/",
  key:
    "?ServiceKey=bl8rMsNR%2FFJz%2FCoQAMg9FH1bYNQ4E8TvYDLexwZN2W3%2FHvck1vtDe%2BYHdfxkDMjcGTY%2BfHH8I6pyOM8san7nug%3D%3D",
  defaultInput: "&pageNo=1&numOfRows=10",
  xmlOptions: {
    explicitArray: false,
    valueProcessors: [
      (value, name) => {
        value = processors.parseNumbers(value)
        return value
      },
    ],
  },
}

export default config
