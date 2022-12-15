from abc import ABC, abstractmethod


class Provider(ABC):
    @abstractmethod
    def deploy(self, project, zone, account, config, gateways, machine_type):
        pass


class Deploy:
    def __init__(self, provider: Provider) -> None:
        self._provider = provider

    @property
    def provider(self) -> Provider:
        return self._provider

    @provider.setter
    def provider(self, provider: Provider) -> None:
        self._provider = provider

    def deploy(self, project, zone, account, config, gateways, machine_type):
        self._provider.deploy(project, zone, account, config, gateways, machine_type)
