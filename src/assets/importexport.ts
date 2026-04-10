import { matchList, reloadKey, teamList } from "./global"
import * as htmlToImage from 'html-to-image'
import { Modal } from 'bootstrap'

export async function downloadAsImage() {
  var node = document.getElementById("mainarea")
  if (!node)
    return

  // Replace team score inputs with spans for correct rendering
  const inputs = node.querySelectorAll(".team-score input") as NodeListOf<HTMLInputElement>
  const replacements: { input: HTMLInputElement, span: HTMLSpanElement }[] = []

  inputs.forEach(input => {
    const span = document.createElement("span")
    span.textContent = input.value
    span.className = input.className
    span.style.textAlign = "center"
    span.style.width = "100%"
    span.style.display = "block"

    replacements.push({ input, span })

    input.parentNode!.replaceChild(span, input)
  })

  try {
    const dataUrl = await htmlToImage.toPng(node!)

    var link = document.createElement("a")
    link.download = "bracket.png"
    link.href = dataUrl
    link.click()
  }
  catch {
    console.log('Image export failed')
  }

  // Restore inputs
  replacements.forEach(({ input, span }) => {
    span.parentNode!.replaceChild(input, span)
  })
}

export async function exportToFile() {
  const content = {
    teams: teamList.value,
    matches: matchList.value
  }

  const json = JSON.stringify(content)
  const blob = new Blob([json], { type: "application/octet-stream" })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "bracket-export.fsb"
  anchor.click()

  URL.revokeObjectURL(url)
}

export async function importFromFile() {
  const fileInput = document.createElement("input") as HTMLInputElement
  fileInput.type = "file"
  fileInput.accept = ".fsb"

  fileInput.addEventListener("change", async () => {
    if (fileInput.files?.length == 1) {
      const content = await fileInput.files[0]?.text()
      if (!content)
        return
      const json = JSON.parse(content)

      teamList.value = json.teams
      matchList.value = json.matches
      reloadKey.value++

      // Hide modal
      const element = document.getElementById("ie-modal")
      if (!element)
        return
      const modal = Modal.getOrCreateInstance(element)
      if (!modal)
        return
      modal.hide()
    }
  })

  fileInput.click()
}
