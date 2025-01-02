import Host from "./host";

export class NetworkException extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "NetworkException";
    }
}

export default class Network {
    public constructor(
        private hosts: Host[],
        private subnetForIPv4: string,
        public name: string,
        public description: string,
        public location: string,
        private subnetForIPv6?: string,
        public id?: string
    ) {
        this.verifyEnoughHosts();
        this.changeSubnetForIPv4(subnetForIPv4);
        this.changeSubnetForIPv6(subnetForIPv6);
    }

    public addHost(host: Host): void {
        const ipv4Capacity = this.checkTheCapacityOfHostsOnTheNetworkByIPv4Subnet();
        const ipv6Capacity = this.checkTheCapacityOfHostsOnTheNetworkByIPv6Subnet();

        const maxCapacity = Math.min(ipv4Capacity, ipv6Capacity || Infinity);

        if (this.hosts.length >= maxCapacity) {
            throw new NetworkException("Cannot add more hosts: network capacity exceeded.");
        }

        this.hosts.push(host);
    }

    public removeHost(host: Host): void {
        this.hosts = this.hosts.filter((currentHost) => currentHost.id !== host.id);
        this.verifyEnoughHosts();
    }

    public changeSubnetForIPv4(subnet: string): void {
        const ipv4SubnetRegex = /^(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
        if (!ipv4SubnetRegex.test(subnet)) {
            throw new NetworkException(
                this.id
                    ? `The provided subnet for IPv4 on ID ${this.id} Network was invalid; check the syntax and try again.`
                    : `The provided subnet for IPv4 on Network creation was invalid; check the syntax and try again.`
            );
        }
        this.subnetForIPv4 = subnet;
    }

    public assignedSubnetForIPv4(): string {
        return this.subnetForIPv4;
    }

    public changeSubnetForIPv6(subnet?: string): void {
        if (subnet) {
            const ipv6SubnetRegex = /^([0-9a-fA-F]{0,4}:){1,8}\/[0-9]{1,3}$/;
            if (!ipv6SubnetRegex.test(subnet)) {
                throw new NetworkException(
                    this.id
                        ? `The provided subnet for IPv6 on ID ${this.id} Network was invalid; check the syntax and try again.`
                        : `The provided subnet for IPv6 on Network creation was invalid; check the syntax and try again.`
                );
            }
            this.subnetForIPv6 = subnet;
        } else {
            this.subnetForIPv6 = undefined;
        }
    }

    public assignedSubnetForIPv6(): string | undefined {
        return this.subnetForIPv6;
    }

    public getAvailableHosts(): Host[] {
        return this.hosts;
    }

    private verifyEnoughHosts(): void {
        if (this.hosts.length <= 0) {
            throw new NetworkException("Could not change the network metadata because there aren't enough hosts in the network.");
        }
    }

    private checkTheCapacityOfHostsOnTheNetworkByIPv4Subnet(): number {
        const parts = this.subnetForIPv4.split("/");
        if (parts.length !== 2) {
            throw new NetworkException("Invalid IPv4 subnet format.");
        }
        const prefixLength = parseInt(parts[1], 10);
        if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
            throw new NetworkException("Invalid IPv4 prefix length.");
        }
        return Math.pow(2, 32 - prefixLength) - 2;
    }

    private checkTheCapacityOfHostsOnTheNetworkByIPv6Subnet(): number {
        if (this.subnetForIPv6) {
            const parts = this.subnetForIPv6.split("/");
            if (parts.length !== 2) {
                throw new NetworkException("Invalid IPv6 subnet format.");
            }
            const prefixLength = parseInt(parts[1], 10);
            if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 128) {
                throw new NetworkException("Invalid IPv6 prefix length.");
            }
            return Math.pow(2, 128 - prefixLength);
        }
        return Infinity;
    }
}