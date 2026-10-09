'use client'

import { useState } from 'react'
import { type Page, type Role } from './data'

import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

import Home from './Home'
import Profile from './Profile'
import Management from './Management'
import Division from './Division'
import News from './News'
import NewsDetail from './NewsDetail'
import Alumni from './Alumni'
import Contact from './Contact'

import Login from '../(admin)/Login'
import AdminLayout from '../(admin)/AdminLayout'

import Overview from '../(admin)/pages/Overview'
import AdminNews from '../(admin)/pages/AdminNews'
import AdminEkowir from '../(admin)/pages/AdminEkowir'
import AdminManagement from '../(admin)/pages/AdminManagement'
import AdminDivision from '../(admin)/pages/AdminDivision'
import AdminAlumni from '../(admin)/pages/AdminAlumni'
import AdminOrganization from '../(admin)/pages/AdminOrganization'
import AdminUsers from '../(admin)/pages/AdminUsers'

const ADMIN_PAGES: Page[] = [
    'admin-login', 'admin-overview', 'admin-organization', 'admin-management',
    'admin-division', 'admin-news', 'admin-news-create', 'admin-ekowir',
    'admin-ekowir-create', 'admin-alumni', 'admin-users',
]

export default function App() {
    const [page, setPage] = useState<Page>('home')
    const [role, setRole] = useState<Role | null>(null)
    const [newsDetailId, setNewsDetailId] = useState<number>(1)

    const navigate = (p: Page) => {
        setPage(p)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleNewsDetail = (id: number) => {
        setNewsDetailId(id)
        navigate('news-detail')
    }

    const handleLogin = (r: Role) => {
        setRole(r)
        navigate('admin-overview')
    }

    const handleLogout = () => {
        setRole(null)
        navigate('home')
    }

    const isAdmin = ADMIN_PAGES.includes(page) && page !== 'admin-login'

    // Admin login page — full screen, no layout
    if (page === 'admin-login') {
        return <Login onLogin={handleLogin} onNavigate={navigate} />
    }

    // Admin dashboard — sidebar layout
    if (isAdmin && role) {
        const renderAdminContent = () => {
            switch (page) {
                case 'admin-overview': return <Overview role={role} />
                case 'admin-organization': return <AdminOrganization />
                case 'admin-management': return <AdminManagement />
                case 'admin-division': return <AdminDivision />
                case 'admin-news': return <AdminNews role={role} onNavigate={navigate} />
                case 'admin-ekowir': return <AdminEkowir />
                case 'admin-alumni': return <AdminAlumni />
                case 'admin-users': return <AdminUsers />
                default: return <Overview role={role} />
            }
        }

        return (
            <AdminLayout role={role} currentPage={page} onNavigate={navigate} onLogout={handleLogout}>
                {renderAdminContent()}
            </AdminLayout>
        )
    }

    if (isAdmin && !role) {
        return <Login onLogin={handleLogin} onNavigate={navigate} />
    }

    const renderPublicContent = () => {
        switch (page) {
            case 'home': return <Home onNavigate={navigate} onNewsDetail={handleNewsDetail} />
            case 'profile': return <Profile onNavigate={navigate} />
            case 'management': return <Management />
            case 'division': return <Division />
            case 'news': return <News onNavigate={navigate} onNewsDetail={handleNewsDetail} />
            case 'news-detail': return <NewsDetail newsId={newsDetailId} onNavigate={navigate} onNewsDetail={handleNewsDetail} />
            case 'alumni': return <Alumni />
            case 'contact': return <Contact />
            default: return <Home onNavigate={navigate} onNewsDetail={handleNewsDetail} />
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar currentPage={page} onNavigate={navigate} />
            <main className="flex-1">
                {renderPublicContent()}
            </main>
            <Footer onNavigate={navigate} />
        </div>
    )
}
