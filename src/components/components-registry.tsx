import React, { ComponentType } from 'react';
import { Annotated } from '@/components/Annotated';
import { DynamicComponentProps } from '@/types';
import * as components from '@/components';

export const DynamicComponent: React.FC<DynamicComponentProps> = (props) => {
    const modelName = props.type;

    // Resolve component by content type
    if (!modelName) {
        throw new Error(`Object does not have a 'type' property: ${JSON.stringify(props, null, 2)}`);
    }

    const Component = components[modelName] as ComponentType;
    if (!Component) {
        throw new Error(`No component matches type: '${modelName}'`);
    }

    return (
        <Annotated content={props}>
            <Component {...props} />
        </Annotated>
    );
};
