import React, { FC, ReactElement } from 'react';
import { EdgeData } from '../../types';
import { Label, LabelProps } from '../Label';
import { Remove, RemoveProps } from '../Remove';
import { Add, AddProps } from '../Add';
export interface EdgeSections {
    id?: string;
    startPoint?: {
        x: number;
        y: number;
    };
    endPoint?: {
        x: number;
        y: number;
    };
    bendPoints?: {
        x: number;
        y: number;
    };
}
export interface EdgeProps {
    id: string;
    disabled?: boolean;
    source: string;
    sourcePort: string;
    target: string;
    targetPort: string;
    properties?: EdgeData;
    style?: any;
    sections: EdgeSections[];
    labels?: LabelProps[];
    className?: string;
    add: ReactElement<AddProps, typeof Add>;
    label: ReactElement<LabelProps, typeof Label>;
    remove: ReactElement<RemoveProps, typeof Remove>;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>, data: EdgeData) => void;
    onKeyDown?: (event: React.KeyboardEvent<SVGGElement>, data: EdgeData) => void;
    onEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: EdgeData) => void;
    onLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: EdgeData) => void;
    onRemove?: (event: React.MouseEvent<SVGGElement, MouseEvent>, edge: EdgeData) => void;
    onAdd?: (event: React.MouseEvent<SVGGElement, MouseEvent>, edge: EdgeData) => void;
}
export declare const Edge: FC<Partial<EdgeProps>>;
