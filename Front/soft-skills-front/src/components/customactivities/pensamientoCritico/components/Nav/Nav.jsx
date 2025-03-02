import { useNavigate } from 'react-router-dom';

import './Nav.css'

const Nav = () => {
    const history = useNavigate()

    const goToDebate = () => {
        history("/activity/debate-ia")
    }
    const goToReport = () => {
        history("/activity/debate-ia/reports")
    }
    return (
        <nav className='nav-ia-section'>
            <div>IA Debate</div>
            <div onClick={goToDebate}>Debates</div>
            <div onClick={goToReport}>Reporte</div>
        </nav>
    )
}

export default Nav;