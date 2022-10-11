import { NavLink, Outlet, useLocation } from "react-router-dom";
// import getInvoices from "../../data";

const CATEGORIES = {
  0: "Top Diffs",  
  1: "Fruit & Veg",
  2: "Meat, Seafood & Deli",  
  3: "Bakery",
  4: "Dairy, Eggs & Fridge",
  5: "Pantry",
  6: "Freezer",
  7: "Drinks",
  8: "Liquor",
  9: "Front of Store",
  10: "Pet",
  11: "Baby",
  12: "Health & Beauty",
  13: "Household"
}
const QueryNavLink = ({ to, ...props }) => {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}

export const Categories = () => {
  const filter = 'woolworths'
  const category = ''
  let categories = Object.entries(CATEGORIES);
  // let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="main-container">
      <a  className="btnbrowse">Browsing {category}
        <span ><i className="fas fa-arrow-down"></i></span>
        <span ><i className="fas fa-arrow-up"></i></span>
      </a>
      <div className="main-content">
        <div  className="categories-pane">
        { categories.map((category) => (
          <div className="catitem" key={category[0]}>
            <QueryNavLink className='catlink thumb' 
              to={`/${category[0]}/${filter}`}
            >
              {category[1]}
            </QueryNavLink>
          </div>
        ))}
        </div>
        <div className="content-pane">
          <div id="routedContent"><Outlet /></div>
          <footer className="text-center"><a className="footer" href="/about">About</a></footer>
        </div>
      </div>
      <div className="spinner-wrapper" hidden>
        <div className="loadingio-spinner-spinner-ev6jh5v9rqq"><div className="ldio-5h29m0fq6k6">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div></div>
      </div>
    </div>


    // <div id="productModal" className="modal">
    //   <div className="modal-content">
    //     <div className="modal-header">
    //       <h2 className="modalheader">{{ modalheader }}</h2>
    //       <button className="closebtn btn btn-primary" type="button">
    //         CLOSE
    //       </button>
    //     </div>
    //     <div className="modal-body">
    //       <p>Elastic Query Search :
    //         <textarea className="searcharea" rows="20" cols="90" ng-model="searchTerm"  autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
    //     </div>
    //   </div>
    // </div>
    // <div id="bundalModal" className="modal">
    //   <div className="modal-content">
    //     <div className="modal-header">
    //       <h2 className="modalheader">{{ modalheader }}</h2>
    //       <button className="closebtn btn btn-primary" type="button">
    //         CLOSE
    //       </button>
    //     </div>
    //     <div className="modal-body" >
    //       <div className="bundle-child" ng-repeat="child in children">
    //         <a href="https://shop.coles.com.au/a/a-vic-metro-burwood-east/product/{{ child.coles.seo }}" target="_blank">
    //           <!--<img className="product-image" src="https://shop.coles.com.au{{ child.coles.smallImage }}">-->
    //           {{ child.coles.brand }} {{ child.coles.name }}</a>
    //       </div>
    //     </div>
    //     <div className="modal-footer">
    //       <h3 className="modalfooter"> {{ modalfooter }}</h3>
    //     </div>
    //   </div>
    // </div>
    // <div id="shareSocialModal" className="modal">
    //   <div className="modal-content">
    //     <div className="modal-header">
    //       <h2 className="modalheader">Share on Social Media</h2>
    //       <button className="closebtn btn btn-primary" type="button">
    //         CLOSE
    //       </button>
    //     </div>
    //     <div className="modal-body" >
    //       <socialshare></socialshare>
    //     </div>
    //   </div>
    // </div>
    
  );
}