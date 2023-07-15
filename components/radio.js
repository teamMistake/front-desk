import { createContext, useContext } from "react";

const RadioContext = createContext({});

function Radio({ value, className, disabled }) {
    const group = useContext(RadioContext);

    return (
        <input
            className={className}
            type='radio'
            value={value}
            disabled={disabled || group.disabled}
            checked={group.value !== undefined ? value === group.value : undefined}
            onChange={(e) => group.onChange && group.onChange(e.target.value)}
        />
    );
}

function RadioGroup({ children, ...rest }) {
    return <RadioContext.Provider value={rest}>{children}</RadioContext.Provider>;
}

export { Radio, RadioContext, RadioGroup };
