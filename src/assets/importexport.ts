import { fitCanvas, matchList, reloadKey, teamList } from "./global"
import * as htmlToImage from 'html-to-image'
import { Modal } from 'bootstrap'
import { nextTick } from "vue"

const BASELINE_CARD_HEIGHT = 100

export async function downloadAsImage(quality: number) {
  var node = document.getElementById("mainarea")
  if (!node || matchList.value.length < 1)
    return

  const rememberBackgroundcolor = node.style.backgroundColor
  const rememberWidth = node.style.maxWidth
  const rememberHeight = node.style.maxHeight
  const inputs = node.querySelectorAll(".team-score input") as NodeListOf<HTMLInputElement>
  const replacements: { input: HTMLInputElement, span: HTMLSpanElement }[] = []

  fitCanvas.value = true
  // Set background color to transparent and remove transitions
  node.style.backgroundColor = "transparent"
  node.classList.add("no-transition")
  // Replace team score inputs with spans for correct rendering
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

  await nextTick()

  const canvas = node.querySelector("#canvas")! as HTMLElement
  node.style.maxWidth = canvas.style.width
  node.style.maxHeight = canvas.style.height

  // Calculate pixel ratio
  const matchCardHeight = document.querySelector(".match-card")!.getBoundingClientRect().height
  const pixelRatio = (BASELINE_CARD_HEIGHT * quality) / matchCardHeight

  await nextTick()

  try {
    const dataUrl = await htmlToImage.toPng(node!, {
      backgroundColor: "transparent",
      pixelRatio: pixelRatio,
      quality: 1
    })

    var link = document.createElement("a")
    link.download = "bracket.png"
    link.href = dataUrl
    link.click()
  }
  catch {
    console.log('Image export failed')
  }

  // Restore width+height
  node.style.maxWidth = rememberWidth
  node.style.maxHeight = rememberHeight
  fitCanvas.value = false
  // Restore background color
  node.style.backgroundColor = rememberBackgroundcolor
  // Restore inputs
  replacements.forEach(({ input, span }) => {
    span.parentNode!.replaceChild(input, span)
  })
  // Reenable transition
  node.classList.remove("no-transition")
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
