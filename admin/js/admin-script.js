/**
 * AI Comment Checker 管理后台脚本
 *
 * @package AI_Comment_Checker
 */

(function($) {
    'use strict';
    
    /**
     * 文档加载完成后执行
     */
    $(document).ready(function() {
        
        /**
         * 清空日志按钮点击事件
         */
        $('#clear-logs-btn').on('click', function(e) {
            e.preventDefault();

            var $button = $(this);

            // 禁用按钮，防止重复点击
            $button.prop('disabled', true).text(aiCommentChecker.strings.processing);

            // 发送 AJAX 请求清空日志
            $.ajax({
                url: aiCommentChecker.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_comment_checker_clear_logs',
                    nonce: aiCommentChecker.nonce
                },
                success: function(response) {
                    // 无论成功或失败，都直接刷新页面
                    location.reload();
                },
                error: function() {
                    // 发生错误时也刷新页面
                    location.reload();
                }
            });
        });
        
        /**
         * 显示/隐藏 API 密钥
         */
        var $apiKeyInput = $('#api_key');
        if ($apiKeyInput.length) {
            // 创建显示/隐藏按钮
            var $toggleButton = $('<button type="button" class="button" style="margin-left: 10px;">' + aiCommentChecker.strings.show + '</button>');

            $apiKeyInput.after($toggleButton);

            $toggleButton.on('click', function(e) {
                e.preventDefault();

                if ($apiKeyInput.attr('type') === 'password') {
                    $apiKeyInput.attr('type', 'text');
                    $toggleButton.text(aiCommentChecker.strings.hide);
                } else {
                    $apiKeyInput.attr('type', 'password');
                    $toggleButton.text(aiCommentChecker.strings.show);
                }
            });
        }
        
        /**
         * 表单验证
         */
        $('form').on('submit', function(e) {
            var isValid = true;
            var errorMessages = [];

            // 验证 API 端点
            var apiEndpoint = $('#api_endpoint').val().trim();
            if (!apiEndpoint) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.apiEndpointEmpty);
            } else if (!isValidUrl(apiEndpoint)) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.apiEndpointInvalid);
            }

            // 验证 API 密钥
            var apiKey = $('#api_key').val().trim();
            if (!apiKey) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.apiKeyEmpty);
            }

            // 验证模型 ID
            var modelId = $('#model_id').val().trim();
            if (!modelId) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.modelIdEmpty);
            }

            // 验证温度
            var temperature = parseFloat($('#temperature').val());
            if (isNaN(temperature) || temperature < 0 || temperature > 2) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.temperatureInvalid);
            }

            // 验证系统提示词
            var systemPrompt = $('#system_prompt').val().trim();
            if (!systemPrompt) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.systemPromptEmpty);
            }

            // 验证分数阈值
            var threshold = parseInt($('#score_threshold').val());
            if (isNaN(threshold) || threshold < 0 || threshold > 100) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.thresholdInvalid);
            }

            // 验证超时时间
            var timeout = parseInt($('#timeout').val());
            if (isNaN(timeout) || timeout < 5) {
                isValid = false;
                errorMessages.push(aiCommentChecker.strings.timeoutInvalid);
            }

            // 如果验证失败，显示错误消息
            if (!isValid) {
                e.preventDefault();
                alert(aiCommentChecker.strings.validationFailed + '\n\n' + errorMessages.join('\n'));
            }
        });
        
        /**
         * 验证 URL 格式
         */
        function isValidUrl(url) {
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        }
    });
    
})(jQuery);

