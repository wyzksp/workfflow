package http1

import (
	workflowpkg "github.com/wyzksp/workflow/pkg/apiclient/workflow"
)

type podLogsClient struct{ serverSentEventsClient }

func (f *podLogsClient) Recv() (*workflowpkg.LogEntry, error) {
	v := &workflowpkg.LogEntry{}
	return v, f.RecvEvent(v)
}
