
import { useNavigate } from "react-router-dom"

export default function BackButton() {
  const navigate = useNavigate();
  const goBack = () => {
		navigate(-1);
	}
	
  return (
		<div className="centerbtn">
			<button onClick={goBack} className="btn btn-primary" type="button">
				GO BACK
			</button>
		</div>
  )
}
