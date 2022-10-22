export function CartActions({ addToCartHandler, removeFromCartHandler }) {
  return (
    <>
      <button className="btn btn-primary addCart" onClick={addToCartHandler}>
        <i className="fas fa-plus-circle"></i>
      </button>
      <button className="btn btn-primary removeCart" onClick={removeFromCartHandler}>
        <i className="fas fa-minus-circle"></i>
      </button>
    </>
  )
}
