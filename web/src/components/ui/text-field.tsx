import { IconEye, IconEyeClosed } from "@intentui/icons";
import { useState } from "react";
import {
	Button as ButtonPrimitive,
	type InputProps,
	TextField as TextFieldPrimitive,
	type TextFieldProps as TextFieldPrimitiveProps,
} from "react-aria-components";

import { Description, FieldError, FieldGroup, type FieldProps, Input, Label } from "./field.tsx";
import { Loader } from "./loader.tsx";
import { composeTailwindRenderProps } from "./utils.ts";

type InputType = Exclude<InputProps["type"], "password">;

interface BaseTextFieldProps extends TextFieldPrimitiveProps, FieldProps {
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	isPending?: boolean;
	className?: string;
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
	isRevealable: true;
	type: "password";
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
	isRevealable?: never;
	type?: InputType;
}

type TextFieldProps = RevealableTextFieldProps | NonRevealableTextFieldProps;

const TextField = ({
	placeholder,
	label,
	description,
	errorMessage,
	prefix,
	suffix,
	isPending,
	className,
	isRevealable,
	type,
	...props
}: TextFieldProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const inputType = isRevealable ? (isPasswordVisible ? "text" : "password") : type;
	const handleTogglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};
	return (
		<TextFieldPrimitive
			type={inputType}
			{...props}
			className={composeTailwindRenderProps(className, "group flex flex-col gap-y-1")}
		>
			{props.children ? (
				props.children
			) : (
				<>
					{label && <Label>{label}</Label>}
					<FieldGroup
						isDisabled={props.isDisabled}
						isInvalid={!!errorMessage}
						data-loading={isPending ? "true" : undefined}
					>
						{prefix && typeof prefix === "string" ? (
							<span className="ml-2 text-muted-fg">{prefix}</span>
						) : (
							prefix
						)}
						<Input placeholder={placeholder} />
						{isRevealable ? (
							<ButtonPrimitive
								type="button"
								aria-label="Toggle password visibility"
								onPress={handleTogglePasswordVisibility}
								className="relative mr-1 grid shrink-0 place-content-center rounded-sm border-transparent outline-hidden *:data-[slot=icon]:text-muted-fg focus-visible:*:data-[slot=icon]:text-primary"
							>
								{isPasswordVisible ? <IconEyeClosed /> : <IconEye />}
							</ButtonPrimitive>
						) : isPending ? (
							<Loader variant="spin" />
						) : suffix ? (
							typeof suffix === "string" ? (
								<span className="mr-2 text-muted-fg">{suffix}</span>
							) : (
								suffix
							)
						) : null}
					</FieldGroup>
					{description && <Description>{description}</Description>}
					<FieldError>{errorMessage}</FieldError>
				</>
			)}
		</TextFieldPrimitive>
	);
};

export { TextField };
export type { TextFieldProps };
