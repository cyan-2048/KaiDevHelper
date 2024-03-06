import { signal } from "@preact/signals";
import { extractAppAsset, runCmd, setSystemProperty, setSystemSetting } from "./lib/wallace";

const page = signal("home");

const NOOP = () => {};
const errorCb = function () {
	// @ts-ignore
	console.log(this);
	// @ts-ignore
	console.log(this.error);
	// @ts-ignore
	alert("Something went wrong: " + this.error.name);
};

window.addEventListener("keyup", (e) => {
	const curentPage = page.peek();
	if (curentPage == "home") {
		if (e.key == "1") {
			page.value = "adb";
		}
		if (e.key == "2") {
			setSystemProperty("ctl.restart", "b2g");
		}
		if (e.key == "3") {
			setSystemSetting(
				"debugger.remote-mode",
				"adb-devtools",
				function () {
					alert("Debug Mode enabled.");
				},
				errorCb
			);
		}
		if (e.key == "4") {
			extractAppAsset(
				"wallace-toolbox.bananahackers.net",
				"rsrc/adbd.bin",
				"/data/local/tmp/adbd",
				function () {
					runCmd(
						`mount -o remount,rw /;sleep 0.5;stop adbd;mv /sbin/adbd /sbin/adbd.orig;cp /data/local/tmp/adbd /sbin/adbd;chown root:root /sbin/adbd && chmod 750 /sbin/adbd;mount -o remount,ro /;rm /data/local/tmp/adbd;sleep 0.5;start adbd`,
						function () {
							alert("Rooted ADB access until reboot");
						},
						errorCb
					);
				},
				errorCb
			);
		}
	}

	if (curentPage == "adb") {
		if (e.key == "1") {
			const propSet = { "service.adb.tcp.port": 5555, "ctl.stop": "adbd", "ctl.start": "adbd" };

			for (let key in propSet) {
				// @ts-ignore
				setSystemProperty(key, propSet[key]);
			}
			alert("ADB port has been set to 5555.");
		}
		if (e.key == "2") {
			const result = prompt("ADB Port", "5555");
			if (result) {
				adbPort.value = result;
			}
		}
		if (e.key == "3") {
			// @ts-ignore
			const wifi = navigator.mozWifiManager;
			if (wifi.enabled) {
				privateIP.value = wifi.connectionInformation.ipAddress;
			} else {
				privateIP.value = "Wifi is disabled";
			}
		}
		if (e.key == "4") {
			runCmd(
				"stop adbd;sleep 0.5;start adbd",
				function () {
					alert("ADB restarted");
				},
				errorCb
			);
		}
		if (e.key == "5") {
			page.value = "home";
		}
	}
});

const privateIP = signal("");
const adbPort = signal("5555");

function ADBToolset() {
	return (
		<div>
			<div>Current Local IP: {privateIP}</div>
			<div>1. adb tcpip {adbPort}</div>
			<div>2. Set ADB port</div>
			<div>3. Get Local IP</div>
			<div>4. Restart ADB</div>
			<div>5. Go Back</div>
		</div>
	);
}

function Home() {
	return (
		<div>
			<div>1. ADB toolset</div>
			<div>2. Restart b2g (doesn't really work)</div>
			<div>3. Enable Debug Mode</div>
			<div>4. Root</div>
		</div>
	);
}

export default function App() {
	return page.value === "home" ? <Home /> : <ADBToolset />;
}
