const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=id]').value
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
    const productCard = btn.closest('article');

    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    }).then(res => {
        return res.json()
    }).then(data => {
        productCard.parentNode.removeChild(productCard)
    }).catch(err => {
        console.log(err)
    })
}