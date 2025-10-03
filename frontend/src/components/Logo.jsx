import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

function Logo() {
  return (
    <Link to="../">
        <h1 className="text-6xl font-inria text-[#5A311F]">
            PRODUCKTIVITY
        </h1>
    </Link>
  )
}

export default Logo