import React, { FC } from 'react';
export interface RemoveProps {
    x: number;
    y: number;
    hidden?: boolean;
    size?: number;
    className?: string;
    onEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
}
export declare const Remove: FC<Partial<RemoveProps>>;
