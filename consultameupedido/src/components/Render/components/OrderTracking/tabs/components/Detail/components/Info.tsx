const Info = ({ title = "", children, actions }: any) => {
    return (
        <>
            <div className="flex items-center justify-between font-bold mb-2">
                {title}
                {actions}
            </div>
            <div className="flex px-1 flex-col gap-1">{children}</div>
        </>
    );
};

export default Info;
