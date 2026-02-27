import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
    const { t } = useTranslation();

    return (
        <nav className="bottom-nav">
            <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <Home size={24} />
                <span>{t('navHome')}</span>
            </NavLink>

            <NavLink
                to="/dashboard/schemes"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <FileText size={24} />
                <span>{t('navSchemes')}</span>
            </NavLink>

            <NavLink
                to="/dashboard/emergency"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <AlertTriangle size={24} />
                <span>{t('navEmergency')}</span>
            </NavLink>
        </nav>
    );
}
