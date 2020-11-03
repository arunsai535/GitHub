import React, { Component } from 'react';

export class Header extends Component {
render(){
    return (
        <div className="header-bg">
            <nav className="header-navbar navbar-expand-md navbar navbar-with-menu navbar-static-top navbar-dark bg-gradient-x-grey-blue navbar-border navbar-brand-center">
                <div className="navbar-wrapper">
                    <div className="navbar-header">
                        <ul className="nav navbar-nav flex-row">
                            <li className="nav-item mobile-menu d-md-none mr-auto"><a className="nav-link nav-menu-main menu-toggle hidden-xs" href ><i className="ft-menu font-large-1"></i></a></li>
                            <li className="nav-item">
                                <a className="navbar-brand mr-0" href="/" >
                                    <img className="brand-logo" alt="stack admin logo" src="app-assets/images/dsi-logo.png"/>
                                    
                                </a>
                            </li>
                            <li className="nav-item d-md-none" >
                                <a className="nav-link open-navbar-container" data-toggle="collapse" data-target="#navbar-mobile" href ><i className="fa fa-ellipsis-v"></i></a>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-container content">
                        <div className="collapse navbar-collapse" id="navbar-mobile">
                            {/* <ul className="nav navbar-nav mr-auto float-left">
                                <li className="nav-item d-none d-md-block">
                                    <a className="nav-link nav-menu-main menu-toggle hidden-xs" style={{pointerEvents: "none"}} href></a>

                                </li>
                            </ul> */}
                            {/* <ul className="nav navbar-nav float-right">
                                <li className="dropdown dropdown-user nav-item">
                                    <a className="dropdown-toggle nav-link dropdown-user-link" href data-toggle="dropdown">
                                        <span className="avatar avatar-online">
                                            <img src="app-assets/images/portrait/small/avatar-s-1.png" alt="avatar"/><i></i></span>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href ><i className="ft-power"></i>Logout</a>
                                    </div>
                                </li>
                            </ul> */}
                        </div>
                    </div>
                </div>
            </nav>
                <div className="header-navbar navbar-expand-sm navbar navbar-horizontal navbar-dark navbar-without-dd-arrow navbar-shadow menu-border"
                    role="navigation" data-menu="menu-wrapper">
                    <div className="navbar-container main-menu-content" data-menu="menu-container">
                        <ul className="nav navbar-nav" id="main-menu-navigation" data-menu="menu-navigation">
                            <li className="nav-item">
                                <a className="nav-link" href="/">
                                    <span>Home</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="http://www.acrdsi.org" >
                                    <span>DSI Home</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}