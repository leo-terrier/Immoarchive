export const Underline = ({ children }: { children: React.ReactNode }) => (
    <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        {children}
    </span>
)
