import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import LinksPage from './pages/LinksPage'
import CreatePage from './pages/CreatePage'
import DetailPage from './pages/DetailPage'
import AuthPage from './pages/AuthPage'

export const useRoutes = isAuthenticate => {
    if (isAuthenticate) {
        return (
            <Routes>
                <Route path='/links' element={<LinksPage/>} exact/>
                <Route path='/create' element={<CreatePage/>} exact/>
                <Route path='/detail/:id' element={<DetailPage/>}/>

                {/!*If the curve is a link then go to*!/}
                <Navigate to='/create'/>
            </Routes>
        )
    }

    return (
        // <Routes><Route path='/auth' element={<AuthPage />} exact /></Routes>
        <Routes>
            <Route path='/auth' element={<AuthPage/>} exact/>

            //**Is the curve is a link then go to
            {/*<Navigate to="/"/>*/}
        </Routes>
    )
}
