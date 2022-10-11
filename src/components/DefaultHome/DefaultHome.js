export const DefaultHome = () => {
  return (
    <>
    <div className="homepage text-center">
        <img className="img-fluid" src="/img/GroceryHawker-03.png" alt="df"/>
    </div>
    <div className="text-center">
        <h4 ng-if="auth.isAuthenticated()">
            Welcome sdfsdf
            <button
                    id="qsLogoutBtn"
                    className="btn btn-primary btn-margin"
                    ng-if="auth.isAuthenticated()"
                    ng-click="auth.logout()">
                Log Out
            </button>
        </h4>
    </div>
    </>
  )
}

