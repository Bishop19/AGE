import os
import re
from app.controllers.tests.tools.load_test import Tool


class JMeter(Tool):
    def get_startup_script(self):
        return open(
            os.path.join(os.path.dirname(__file__), "scripts/startup-script-jmeter.sh"),
            "r",
        ).read()

    def prepare_test_file(self, test_file, ip, port):
        test_file = re.sub(
            r'<stringProp name="Argument.name">URL</stringProp>(\n.+)<stringProp name="Argument.value">(\w|\.)+</stringProp>',
            r'<stringProp name="Argument.name">URL</stringProp>\1<stringProp name="Argument.value">'
            + str(ip)
            + "</stringProp>",
            test_file,
        )

        test_file = re.sub(
            r'<stringProp name="Argument.name">PORT</stringProp>(\n.+)<stringProp name="Argument.value">\d+</stringProp>',
            r'<stringProp name="Argument.name">PORT</stringProp>\1<stringProp name="Argument.value">'
            + str(port)
            + "</stringProp>",
            test_file,
        )

        return test_file
