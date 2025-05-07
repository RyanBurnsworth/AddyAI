import pytest
from services.model_service import ModelService

# ✅ Success case
def test_get_llm_response_success(mocker):
    model_service = ModelService()

    mock_response = mocker.Mock()
    mock_response.output_text = "Mocked GPT response"

    mocker.patch.object(
        model_service.client.responses,
        "create",
        return_value=mock_response
    )

    result = model_service.get_llm_response("System prompt", "User prompt")
    assert result == "Mocked GPT response"

@pytest.mark.parametrize("exception_type, kwargs", [
    (Exception, {
        "args": ("Simulated generic error",)
    }),
])
def test_get_llm_response_errors(mocker, exception_type, kwargs):
    model_service = ModelService()

    # Handle Exception separately since it's not a subclass of OpenAI's API errors
    if exception_type is Exception:
        mock_exception = exception_type(*kwargs["args"])
    else:
        mock_exception = exception_type(**kwargs)

    mocker.patch.object(
        model_service.client.responses,
        "create",
        side_effect=mock_exception
    )

    with pytest.raises(exception_type):
        model_service.get_llm_response("System prompt", "User prompt")