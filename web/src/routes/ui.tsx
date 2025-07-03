import { createFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Heading } from "~/components/ui/heading";
import { Link } from "~/components/ui/link";
import { Loader } from "~/components/ui/loader";
import { TextField } from "~/components/ui/text-field";

export const Route = createFileRoute("/ui")({
	component: UiShowcase,
});

function UiShowcase() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="mx-auto max-w-4xl space-y-12">
				<div className="text-center">
					<Heading level={1}>UI Components Showcase</Heading>
					<p className="mt-2 text-gray-600">
						A collection of all UI components for debugging and documentation
					</p>
				</div>

				{/* Buttons */}
				<section className="space-y-6">
					<Heading level={2}>Buttons</Heading>
					<div className="space-y-4">
						<div className="flex flex-wrap gap-3">
							<Button intent="primary">Primary</Button>
							<Button intent="secondary">Secondary</Button>
							<Button intent="danger">Danger</Button>
							<Button intent="warning">Warning</Button>
							<Button intent="outline">Outline</Button>
							<Button intent="plain">Plain</Button>
						</div>
						<div className="flex flex-wrap gap-3">
							<Button size="extra-small">Extra Small</Button>
							<Button size="small">Small</Button>
							<Button size="medium">Medium</Button>
							<Button size="large">Large</Button>
							<Button size="square-petite">□</Button>
						</div>
						<div className="flex flex-wrap gap-3">
							<Button shape="square">Square</Button>
							<Button shape="circle">Circle</Button>
						</div>
						<div className="flex flex-wrap gap-3">
							<Button isDisabled={true}>Disabled</Button>
							<Button isPending={true}>Pending</Button>
						</div>
					</div>
				</section>

				{/* Text Fields */}
				<section className="space-y-6">
					<Heading level={2}>Text Fields</Heading>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<TextField label="Basic Text Field" placeholder="Enter text..." />
						<TextField
							label="With Description"
							description="This is a helpful description"
							placeholder="Enter text..."
						/>
						<TextField
							label="With Error"
							errorMessage="This field is required"
							placeholder="Enter text..."
						/>
						<TextField
							label="Password Field"
							type="password"
							isRevealable={true}
							placeholder="Enter password..."
						/>
						<TextField label="With Prefix" prefix="$" placeholder="0.00" />
						<TextField label="With Suffix" suffix="USD" placeholder="Amount" />
						<TextField label="Pending State" isPending={true} placeholder="Loading..." />
						<TextField label="Disabled" isDisabled={true} placeholder="Disabled field" />
					</div>
				</section>

				{/* Headings */}
				<section className="space-y-6">
					<Heading level={2}>Headings</Heading>
					<div className="space-y-4">
						<Heading level={1}>Heading Level 1</Heading>
						<Heading level={2}>Heading Level 2</Heading>
						<Heading level={3}>Heading Level 3</Heading>
						<Heading level={4}>Heading Level 4</Heading>
						<Heading level={5}>Heading Level 5</Heading>
						<Heading level={6}>Heading Level 6</Heading>
					</div>
				</section>

				{/* Links */}
				<section className="space-y-6">
					<Heading level={2}>Links</Heading>
					<div className="space-y-4">
						<div className="flex flex-wrap gap-6">
							<Link intent="primary" href="#">
								Primary Link
							</Link>
							<Link intent="secondary" href="#">
								Secondary Link
							</Link>
							<Link intent="unstyled" href="#">
								Unstyled Link
							</Link>
						</div>
						<div className="flex flex-wrap gap-6">
							<Link href="#" isDisabled={true}>
								Disabled Link
							</Link>
						</div>
					</div>
				</section>

				{/* Loaders */}
				<section className="space-y-6">
					<Heading level={2}>Loaders</Heading>
					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-6">
							<div className="flex items-center gap-2">
								<Loader variant="spin" />
								<span>Spin</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader variant="ring" />
								<span>Ring</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader variant="bars" />
								<span>Bars</span>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-6">
							<div className="flex items-center gap-2">
								<Loader size="small" />
								<span>Small</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader size="medium" />
								<span>Medium</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader size="large" />
								<span>Large</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader size="extra-large" />
								<span>Extra Large</span>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-6">
							<div className="flex items-center gap-2">
								<Loader intent="primary" />
								<span>Primary</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader intent="secondary" />
								<span>Secondary</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader intent="success" />
								<span>Success</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader intent="warning" />
								<span>Warning</span>
							</div>
							<div className="flex items-center gap-2">
								<Loader intent="danger" />
								<span>Danger</span>
							</div>
						</div>
					</div>
				</section>

				{/* Dialog Preview */}
				<section className="space-y-6">
					<Heading level={2}>Dialog</Heading>
					<div className="space-y-4">
						<p className="text-gray-600">
							Dialog components are interactive and shown via triggers. Here's a static preview of
							dialog structure:
						</p>
						<div className="rounded-lg border bg-white p-4">
							<Dialog.Header title="Dialog Title" description="Dialog description" />
							<Dialog.Body>
								<p>This is the dialog body content.</p>
							</Dialog.Body>
							<Dialog.Footer>
								<Button intent="outline">Cancel</Button>
								<Button intent="primary">Confirm</Button>
							</Dialog.Footer>
						</div>
					</div>
				</section>

				{/* Color Palette */}
				<section className="space-y-6">
					<Heading level={2}>Color Reference</Heading>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="space-y-2">
							<div className="h-16 w-full rounded bg-primary" />
							<p className="font-medium text-sm">Primary</p>
						</div>
						<div className="space-y-2">
							<div className="h-16 w-full rounded bg-secondary" />
							<p className="font-medium text-sm">Secondary</p>
						</div>
						<div className="space-y-2">
							<div className="h-16 w-full rounded bg-danger" />
							<p className="font-medium text-sm">Danger</p>
						</div>
						<div className="space-y-2">
							<div className="h-16 w-full rounded bg-warning" />
							<p className="font-medium text-sm">Warning</p>
						</div>
						<div className="space-y-2">
							<div className="h-16 w-full rounded bg-success" />
							<p className="font-medium text-sm">Success</p>
						</div>
						<div className="space-y-2">
							<div className="h-16 w-full rounded bg-muted" />
							<p className="font-medium text-sm">Muted</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
