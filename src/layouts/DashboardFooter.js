import React from 'react'

const DashboardFooter = (props) => {
    return (
        <footer>
            <hr/>
            <div className="text-center">
                <p className="text-muted mt-2">
                    Copyright &copy; {new Date().getFullYear()} Vian Hub Salon
                </p>
            </div>
        </footer>
    )
};

export default DashboardFooter
