import jsPDF from "jspdf"
import { ProductInstance } from "../shared/types"

export const generateProductCertification = (product: ProductInstance, ownerInfo: string, manufacturerName: string, distributorName: string, retailerName: string) => {
    const pdf = new jsPDF()

    const imageURL = '/src/assets/logo.png'

    pdf.text('Smart Supply', 30, 17)


    pdf.setFontSize(16)
    const title = `Product Certification for ${product.product?.name}`
    const titleWidth = pdf.getTextWidth(title)
    const centerX = (pdf.internal.pageSize.width - titleWidth) / 2

    pdf.addImage(imageURL, 'PNG', 10, 5, 20, 20)

    pdf.text(title, centerX, 30)

    pdf.setFontSize(12)
    const text_1 = `This is to certify that ${ownerInfo} has purchased a certified product ${product.product?.name} that was:`
    const text_1Width = pdf.getTextWidth(text_1)
    const centerX_text = (pdf.internal.pageSize.width - text_1Width) / 2
    pdf.text(text_1, centerX_text, 40)

    pdf.text(`- Produced from: ${manufacturerName}`, 10, 50)
    pdf.text(`- Distributed from: ${distributorName}`, 10, 60)
    pdf.text(`- Sold from: ${retailerName}`, 10, 70)

    pdf.save(`Product_Certification_${product.id}.pdf`)
}