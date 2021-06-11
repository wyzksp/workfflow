package apiserver

import (
	"github.com/wyzksp/workflow/config"
	"github.com/wyzksp/workflow/server/auth/sso"
)

var emptyConfigFunc = func() interface{} { return &Config{} }

type Config struct {
	config.Config
	// SSO in settings for single-sign on
	SSO sso.Config `json:"sso,omitempty"`
}
