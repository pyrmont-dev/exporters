import { OutputFileType, OutputTextFile, Token } from "@supernova-studio/pulsar-next"
import { config } from "../config"
import { AllTokenTypes } from "../helpers/constants"

export function indexOutputFile(tokens: Array<Token>): OutputTextFile {
  // Generate import statement for every token type there is
  // Filter out files where there are no tokens, if enabled
  let content = AllTokenTypes.map((type) => {
    const importStatement = `@import "./${config.styleFileNames[type]}";`
    if (config.generateEmptyFiles) {
      return importStatement
    } else {
      const tokensOfType = tokens.filter((token) => token.tokenType === type)
      return tokensOfType.length > 0 ? importStatement : null
    }
  })
    .filter((c) => c !== null)
    .join("\n")

  if (config.showGeneratedFileDisclaimer) {
    // Add disclaimer to index file if enabled
    content = `/* ${config.disclaimer} */\n${content}`
  }

  return {
    path: config.baseIndexFilePath,
    name: config.indexFileName,
    type: OutputFileType.text,
    content: content,
  }
}