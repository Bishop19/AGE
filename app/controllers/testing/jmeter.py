import os
import re
from app.controllers.testing.load_test import Tool


class JMeter(Tool):
    def get_startup_script(self):
        return open(
            os.path.join(os.path.dirname(__file__), "scripts/startup-script-jmeter.sh"),
            "r",
        ).read()

    def prepare_test_file(self, test_file, ip):
        test_file = re.sub(
            r'<stringProp name="Argument.name">URL</stringProp>((.|\n)+)<stringProp name="Argument.value">(\w|\.)+</stringProp>',
            r'<stringProp name="Argument.name">URL</stringProp>\1<stringProp name="Argument.value">'
            + str(ip)
            + "</stringProp>",
            test_file,
        )

        return test_file
