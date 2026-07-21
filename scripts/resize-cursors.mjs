import fs from "node:fs"
import path from "node:path"
import { PNG } from "pngjs"

const cursorNames = ["peixe", "gato"]
const size = 32

function resizeNearestNeighbor(source) {
  const output = new PNG({ width: size, height: size })

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sourceX = Math.floor((x / size) * source.width)
      const sourceY = Math.floor((y / size) * source.height)
      const sourceIndex = (sourceY * source.width + sourceX) * 4
      const outputIndex = (y * size + x) * 4

      output.data[outputIndex] = source.data[sourceIndex]
      output.data[outputIndex + 1] = source.data[sourceIndex + 1]
      output.data[outputIndex + 2] = source.data[sourceIndex + 2]
      output.data[outputIndex + 3] = source.data[sourceIndex + 3]
    }
  }

  return output
}

for (const name of cursorNames) {
  const sourcePath = path.resolve("public", "mouse", `${name}.png`)
  const outputPath = path.resolve("public", "mouse", `${name}-32.png`)
  const source = PNG.sync.read(fs.readFileSync(sourcePath))

  fs.writeFileSync(outputPath, PNG.sync.write(resizeNearestNeighbor(source)))
}
