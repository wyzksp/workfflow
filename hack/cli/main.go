package main

import (
	"github.com/spf13/cobra/doc"

	"github.com/wyzksp/workflow/cmd/argo/commands"
)

func main() {
	println("generating docs/cli")
	cmd := commands.NewCommand()
	cmd.DisableAutoGenTag = true
	err := doc.GenMarkdownTree(cmd, "docs/cli")
	if err != nil {
		panic(err)
	}
}
