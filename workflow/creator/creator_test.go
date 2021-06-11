package creator

import (
	"context"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"

	"gopkg.in/square/go-jose.v2/jwt"

	wfv1 "github.com/wyzksp/workflow/pkg/apis/workflow/v1alpha1"
	"github.com/wyzksp/workflow/server/auth"
	"github.com/wyzksp/workflow/server/auth/types"
	"github.com/wyzksp/workflow/workflow/common"
)

func TestLabel(t *testing.T) {
	t.Run("Empty", func(t *testing.T) {
		wf := &wfv1.Workflow{}
		Label(context.TODO(), wf)
		assert.Empty(t, wf.Labels)
	})
	t.Run("NotEmpty", func(t *testing.T) {
		wf := &wfv1.Workflow{}
		Label(context.WithValue(context.TODO(), auth.ClaimsKey, &types.Claims{Claims: jwt.Claims{Subject: "my-sub"}}), wf)
		if assert.NotEmpty(t, wf.Labels) {
			assert.Contains(t, wf.Labels, common.LabelKeyCreator)
		}
	})
	t.Run("TooLong", func(t *testing.T) {
		wf := &wfv1.Workflow{}
		Label(context.WithValue(context.TODO(), auth.ClaimsKey, &types.Claims{Claims: jwt.Claims{Subject: strings.Repeat("x", 63) + "y"}}), wf)
		if assert.NotEmpty(t, wf.Labels) {
			assert.Equal(t, strings.Repeat("x", 62)+"y", wf.Labels[common.LabelKeyCreator])
		}
	})
	t.Run("TooLongHyphen", func(t *testing.T) {
		wf := &wfv1.Workflow{}
		Label(context.WithValue(context.TODO(), auth.ClaimsKey, &types.Claims{Claims: jwt.Claims{Subject: strings.Repeat("-", 63) + "y"}}), wf)
		if assert.NotEmpty(t, wf.Labels) {
			assert.Equal(t, "y", wf.Labels[common.LabelKeyCreator])
		}
	})
}
