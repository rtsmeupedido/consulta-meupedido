import styled, { css, keyframes } from "styled-components";

const getUrlIcon = (icon: string) => {
    if (!icon || !Array.isArray(icon) || icon.length !== 2) return null;
    switch (icon[0].slice(-1)) {
        case "b":
            return `./icons/brands/${icon[1]}.svg`;
        case "l":
            return `./icons/light/${icon[1]}.svg`;
        case "r":
            return `./icons/regular/${icon[1]}.svg`;
        case "s":
            return `./icons/solid/${icon[1]}.svg`;
        default:
            return null;
    }
};

const Icon = ({
    icon = ["", ""],
    width = 14,
    color = "#ffffff",
    className = "",
    click = false,
    style = {},
    disabled = false,
    onClick = () => {},
    spin = false,
    ...props
}: {
    icon: any[];
    width?: number;
    color?: string;
    onClick?: (a: any) => void;
    className?: string;
    click?: boolean;
    disabled?: boolean;
    spin?: boolean;
    style?: any;
}) => {
    return (
        <IconStyle
            icon={icon}
            color={color}
            width={width}
            height={width}
            spin={spin}
            className={`${className} ${click ? "hover:brightness-95" : ""}`}
            style={{
                cursor: click ? "pointer" : "",
                pointerEvents: disabled ? "none" : "all",
                opacity: disabled ? 0.4 : 1,
                width: width,
                height: width,
                ...style,
            }}
            onClick={(e: any) => {
                if (disabled) return;
                if (onClick) onClick(e);
            }}
            {...props}
        />
    );
};

const spinK = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const IconStyle = styled.svg<{ icon: any; spin: boolean }>`
    display: inline-flex;
    mask-image: ${({ icon }: any) => `url(${getUrlIcon(icon)})`};
    mask-repeat: no-repeat;
    mask-size: 99% 99%;
    background: ${({ color }) => color || "#FFF"};
    background-color: ${({ color }) => color};
    ${({ spin }: any) =>
        spin &&
        css`
            animation: ${spinK} 1.4s linear infinite;
        `}
`;

Icon.defaultProps = {
    width: 14,
    onClick: () => {},
    icon: ["fas", "question"],
};
export default Icon;
