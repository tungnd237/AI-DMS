import React from 'react';

const LayoutComponent = ({header, body, footer}) => {
    return (
        <div className="px-4">
            <header>
                {header}
            </header>
            <div className="py-8">
                {body}
            </div>
            <footer>
                {footer}
            </footer>
        </div>
    )
};

export default LayoutComponent;