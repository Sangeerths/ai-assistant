import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.16.122/build/pdf.worker.min.js`

export async function extractTextFromPDF(file){
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise
  let text = ''
  for (let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strs = content.items.map(it=>it.str)
    text += strs.join(' ') + '\n'
  }
  return text
}

export async function extractTextFromDocx(file){
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({arrayBuffer})
  return result.value
}

export function parseContactFields(text){
  // naive regex extraction
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,6}/)
  const phoneMatch = text.match(/(\+?\d[\d ()-]{6,}\d)/)
  const nameMatch = text.match(/([A-Z][a-z]+\s[A-Z][a-z]+)/)
  return {
    name: nameMatch ? nameMatch[0] : undefined,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined
  }
}
