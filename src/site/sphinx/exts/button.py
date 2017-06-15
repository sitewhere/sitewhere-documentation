# Original: https://github.com/conda/conda-docs/blob/master/web/button.py

from __future__ import absolute_import
from docutils import nodes
import jinja2
from sphinx.util.compat import Directive
from docutils.parsers.rst.directives import unchanged

HTML_TEMPLATE = jinja2.Template(u"""
<p class="button-wrapper">
<a href="{{ link }}" target="blank"><span class="button">{{ text }}</span></a>
</p>
""")

LATEX_TEMPLATE = jinja2.Template(u"""
\hyperref[{{ link }}]{''{{ text }}''}
""")

# placeholder node for document graph
class button_node(nodes.General, nodes.Element):
    pass

class ButtonDirective(Directive):
    required_arguments = 0

    option_spec = {
        'text': unchanged,
        'link': unchanged,
    }

    # this will execute when your directive is encountered
    # it will insert a button_node into the document that will
    # get visisted during the build phase
    def run(self):
        node = button_node()
        node['text'] = self.options['text']
        node['link'] = self.options['link']
        return [node]

# build phase visitor emits HTML to append to output
def html_visit_button_node(self, node):
    html = HTML_TEMPLATE.render(text=node['text'], link=node['link'])
    self.body.append(html)
    raise nodes.SkipNode

# if you want to be pedantic, define text, latex, manpage visitors too..
def latex_visit_button_node(self, node):
    latex = LATEX_TEMPLATE.render(text=node['text'], link=node['link'])
    self.body.append(latex)
    raise nodes.SkipNode

def setup(app):
    app.add_node(button_node,
                 html=(html_visit_button_node, None),
                 latex=(latex_visit_button_node, None))
    app.add_directive('button', ButtonDirective)