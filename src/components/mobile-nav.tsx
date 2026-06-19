import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
	IconMenu2,
	IconSun,
	IconMoon,
	IconBrandDiscord,
} from "@tabler/icons-react";

function getInitials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0].toUpperCase())
		.join("");
}

interface Props {
	user?: { name: string; email: string } | null;
}

export function MobileNav({ user = null }: Props) {
	const [isDark, setIsDark] = React.useState(false);

	React.useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggleTheme() {
		const dark = !isDark;
		document.documentElement.classList.toggle("dark", dark);
		localStorage.setItem("theme", dark ? "dark" : "light");
		setIsDark(dark);
	}

	async function handleSignOut() {
		const { actions } = await import("astro:actions");
		await actions.signOut();
		window.location.href = "/auth/signin";
	}

	return (
		<Sheet>
			{user ? (
				<SheetTrigger
					className="sm:hidden flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted text-xs font-medium"
					aria-label="Open menu"
				>
					{getInitials(user.name)}
				</SheetTrigger>
			) : (
				<SheetTrigger
					className="sm:hidden inline-flex size-10 cursor-pointer items-center justify-center rounded-4xl transition-colors hover:bg-muted hover:text-foreground"
					aria-label="Open menu"
				>
					<IconMenu2 className="size-5" />
				</SheetTrigger>
			)}
			<SheetContent side="right">
				<div className="flex flex-col gap-1 p-6 pt-16">
					<a
						href="/dashboard"
						className="inline-flex rounded-4xl px-3 text-sm transition-colors hover:bg-muted hover:text-foreground"
					>
						Home
					</a>
					<a
						href="/dashboard"
						className="inline-flex rounded-4xl px-3 text-sm transition-colors hover:bg-muted hover:text-foreground"
					>
						Dashboard
					</a>

					<div className="my-2 h-px bg-border" />

					{user ? (
						<>
							<div className="mb-2 flex items-center gap-2 px-3">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
									{getInitials(user.name)}
								</div>
								<span className="truncate text-sm font-medium">
									{user.name}
								</span>
							</div>
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={handleSignOut}
							>
								Sign out
							</Button>
						</>
					) : (
						<>
							<a
								href="/auth/signin"
								className="inline-flex h-8 w-full items-center justify-start rounded-4xl px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
							>
								Sign in
							</a>
							<a
								href="/auth/signup"
								className="inline-flex h-8 w-full items-center justify-start rounded-4xl bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
							>
								Sign up
							</a>
						</>
					)}

					<div className="my-2 h-px bg-border" />

					<Button
						variant="ghost"
						className="w-full justify-start gap-2"
						onClick={toggleTheme}
					>
						{isDark ? <IconSun /> : <IconMoon />}
						{isDark
							? "Switch to light mode"
							: "Switch to dark mode"}
					</Button>

					<div className="my-2 h-px bg-border" />

					<a
						href="https://discord.gg/tC5hf9BF"
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-4xl px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
					>
						<IconBrandDiscord
							className="size-4"
							aria-hidden="true"
						/>
						Discord
					</a>
				</div>
			</SheetContent>
		</Sheet>
	);
}
