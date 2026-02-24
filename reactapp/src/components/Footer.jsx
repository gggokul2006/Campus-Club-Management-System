import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="left">
          <div className="mini-logo">CC</div>
          <div>
            <div className="bold">Campus Club Management System</div>
            <div className="muted">Made with ❤️ for students</div>
          </div>
        </div>

        <div className="right">
          <div>© {new Date().getFullYear()} Campus Club Manager</div>
          <div className="muted">Contact: clubs-office@university.edu</div>
        </div>
      </div>
    </footer>
  );
}
