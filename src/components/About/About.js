import './styles.scss'

export const About = () => {
  return (
<div className="about">
<h1>About Page</h1>
This is a grocery comparison website to compare prices of Woolworths and Coles.
It is based on the common product barcode that is used to identify a product. If the barcode for the product exists in both the Coles and Woolworths website and they share the same common value then they will be listed.

	<h1>FAQ</h1>
	<dl>
		<dt>Q: Why can I find same product on Woolworths and Coles website but it not showing in this website?</dt>
		<dl>A: It is either doesn&lsquo;t exist on one website or is different value to the other website. In these instances this is a data issue with the respective website as a common barcode needs to be used to identify a product.
			<p className="preservelines">
				Some examples:
				9347043001573 - Messina Drumstick icecream. Barcode only exists at Woolworths website even though Coles stocks same product and has barcode on the product and exists on their website. This is a Coles website data issue.
				9300633097639 - common barcode in coles and woolworths but woolworths is apples while coles is cherries. Data issue with one of the two.

			</p>
		</dl>
	</dl>

</div>




  )
}
