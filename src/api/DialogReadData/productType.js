function ProductType (productList, typeList = []) {
    const productObj = { input: 0, ng: 0, ok: 0, repair: 0 }
    productList.forEach(categoryListRes => {
        typeList.forEach(typeRes => {
            if (typeRes === categoryListRes.type) {
                switch (categoryListRes.state) {
                    case 'Input': productObj.input += categoryListRes.value; break
                    case 'Ng': productObj.ng += categoryListRes.value; break
                    case 'Ok': productObj.ok += categoryListRes.value; break
                    case 'Repair': productObj.repair += categoryListRes.value; break
                    default: break
                }
            }
        })
    })

    return productObj
}

export default ProductType
